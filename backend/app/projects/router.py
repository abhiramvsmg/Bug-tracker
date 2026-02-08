from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from ..database import get_db
from sqlalchemy import func
from ..models import Workspace, Project, User, workspace_members, Ticket, TicketStatus
from ..schemas import WorkspaceCreate, WorkspaceResponse, ProjectCreate, ProjectResponse, MemberAdd, UserResponse
from ..auth.router import get_current_user

router = APIRouter(prefix="/workspaces", tags=["workspaces"])

# Workspace Endpoints
@router.post("/", response_model=WorkspaceResponse)
async def create_workspace(workspace_in: WorkspaceCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        db_workspace = Workspace(**workspace_in.dict())
        db_workspace.owner_id = current_user.id
        db.add(db_workspace)
        await db.flush() # Get the ID from DB
        ws_id = db_workspace.id
        await db.commit()
        
        # Fetch the workspace with members eagerly loaded
        result = await db.execute(
            select(Workspace)
            .where(Workspace.id == ws_id)
            .options(selectinload(Workspace.members))
        )
        return result.scalars().first()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/", response_model=List[WorkspaceResponse])
async def list_workspaces(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Get owned workspaces and workspaces where user is a member
    # Using selectinload for members to avoid lazy load issues with async
    result = await db.execute(
        select(Workspace)
        .where((Workspace.owner_id == current_user.id) | (Workspace.members.any(id=current_user.id)))
        .options(selectinload(Workspace.members))
    )
    return result.scalars().all()

# Member Management
@router.post("/{workspace_id}/members", status_code=status.HTTP_201_CREATED)
async def add_workspace_member(workspace_id: int, member_in: MemberAdd, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if current user is owner and load members
    ws_result = await db.execute(
        select(Workspace)
        .where(Workspace.id == workspace_id, Workspace.owner_id == current_user.id)
        .options(selectinload(Workspace.members))
    )
    db_workspace = ws_result.scalars().first()
    if not db_workspace:
        raise HTTPException(status_code=403, detail="Only the owner can add members")
    
    # Check if user to add exists
    user_result = await db.execute(select(User).where(User.email == member_in.email))
    user_to_add = user_result.scalars().first()
    if not user_to_add:
        raise HTTPException(status_code=404, detail="User not found. They must register first.")
    
    # Check if already a member
    if user_to_add in db_workspace.members:
        raise HTTPException(status_code=400, detail="User is already a member")
    
    db_workspace.members.append(user_to_add)
    await db.commit()
    return {"message": f"User {member_in.email} added to workspace"}

@router.get("/{workspace_id}/members", response_model=List[UserResponse])
async def list_workspace_members(workspace_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if user is owner or member
    ws_result = await db.execute(
        select(Workspace)
        .where(Workspace.id == workspace_id)
        .where((Workspace.owner_id == current_user.id) | (Workspace.members.any(id=current_user.id)))
    )
    db_workspace = ws_result.scalars().first()
    if not db_workspace:
        raise HTTPException(status_code=404, detail="Workspace not found or no access")
    
    # Load members explicitly
    result = await db.execute(
        select(User).join(workspace_members).where(workspace_members.c.workspace_id == workspace_id)
    )
    members = result.scalars().all()
    
    # Also include owner in the list of people who can be assigned
    owner_result = await db.execute(select(User).where(User.id == db_workspace.owner_id))
    owner = owner_result.scalars().first()
    if owner and owner not in members:
        members.append(owner)
        
    return members

@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workspace(workspace_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id, Workspace.owner_id == current_user.id))
    db_workspace = result.scalars().first()
    if not db_workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found or not owned by you")
    
    await db.delete(db_workspace)
    await db.commit()
    return None

@router.get("/{workspace_id}/projects", response_model=List[ProjectResponse])
async def list_workspace_projects(workspace_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify ownership or membership
    ws_result = await db.execute(
        select(Workspace)
        .where(Workspace.id == workspace_id)
        .where((Workspace.owner_id == current_user.id) | (Workspace.members.any(id=current_user.id)))
    )
    if not ws_result.scalars().first():
        raise HTTPException(status_code=404, detail="Workspace not found or access denied")

    result = await db.execute(select(Project).where(Project.workspace_id == workspace_id))
    return result.scalars().all()

# Project Endpoints
@router.post("/{workspace_id}/projects", response_model=ProjectResponse)
async def create_project(workspace_id: int, project_in: ProjectCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    print(f"\n{'='*50}\n[API] CREATE PROJECT CALLED\nWorkspace: {workspace_id}\nUser: {current_user.email}\n{'='*50}\n")
    # Verify workspace exists and belongs to user or user is a member
    workspace_result = await db.execute(
        select(Workspace)
        .where(Workspace.id == workspace_id)
        .where((Workspace.owner_id == current_user.id) | (Workspace.members.any(id=current_user.id)))
    )
    if not workspace_result.scalars().first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found or access denied")
    
    db_project = Project(**project_in.dict())
    db_project.workspace_id = workspace_id
    db.add(db_project)
    await db.flush()
    project_id = db_project.id
    await db.commit()
    
    result = await db.execute(select(Project).where(Project.id == project_id))
    return result.scalars().first()

@router.get("/{workspace_id}/stats")
async def get_workspace_stats(workspace_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify access
    ws_result = await db.execute(
        select(Workspace)
        .where(Workspace.id == workspace_id)
        .where((Workspace.owner_id == current_user.id) | (Workspace.members.any(id=current_user.id)))
    )
    if not ws_result.scalars().first():
        raise HTTPException(status_code=404, detail="Workspace not found or access denied")

    # Get project count
    project_count_res = await db.execute(select(func.count(Project.id)).where(Project.workspace_id == workspace_id))
    project_count = project_count_res.scalar()

    # Get ticket counts by status workspace-wide
    ticket_stats_res = await db.execute(
        select(Ticket.status, func.count(Ticket.id))
        .join(Project)
        .where(Project.workspace_id == workspace_id)
        .group_by(Ticket.status)
    )
    
    status_counts = {status.value: count for status, count in ticket_stats_res.all()}
    
    return {
        "project_count": project_count,
        "total_tickets": sum(status_counts.values()),
        "status_counts": status_counts
    }

@router.delete("/{workspace_id}/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(workspace_id: int, project_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify the workspace is owned by the user
    ws_result = await db.execute(select(Workspace).where(Workspace.id == workspace_id, Workspace.owner_id == current_user.id))
    if not ws_result.scalars().first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found or not owned by you")

    result = await db.execute(select(Project).where(Project.id == project_id, Project.workspace_id == workspace_id))
    db_project = result.scalars().first()
    if not db_project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    await db.delete(db_project)
    await db.commit()
    return None
