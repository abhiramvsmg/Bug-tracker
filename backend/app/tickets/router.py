from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from ..database import get_db
from ..models import Ticket, Project, User, Workspace, workspace_members, Comment, Attachment, TicketStatus, TicketPriority
from ..schemas import TicketCreate, TicketResponse, TicketUpdate, CommentCreate, CommentResponse, AttachmentResponse
from ..auth.router import get_current_user

router = APIRouter(prefix="/projects/{project_id}/tickets", tags=["tickets"])

@router.post("/", response_model=TicketResponse)
async def create_ticket(
    project_id: int, 
    ticket_in: TicketCreate, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Verify project exists
    project_result = await db.execute(select(Project).where(Project.id == project_id))
    db_project = project_result.scalars().first()
    if not db_project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    # Verify access
    ws_id = db_project.workspace_id
    ws_result = await db.execute(
        select(Workspace)
        .where(Workspace.id == ws_id)
        .where((Workspace.owner_id == current_user.id) | (Workspace.members.any(id=current_user.id)))
    )
    if not ws_result.scalars().first():
        raise HTTPException(status_code=403, detail="Access denied")

    db_ticket = Ticket(**ticket_in.dict())
    db_ticket.project_id = project_id
    db.add(db_ticket)
    await db.commit()
    await db.refresh(db_ticket)
    
    # Reload with deep relations for serialization
    result = await db.execute(
        select(Ticket)
        .where(Ticket.id == db_ticket.id)
        .options(
            selectinload(Ticket.assignee),
            selectinload(Ticket.attachments),
            selectinload(Ticket.comments).selectinload(Comment.author),
            selectinload(Ticket.comments).selectinload(Comment.replies)
        )
    )
    return result.scalars().first()

@router.get("/", response_model=List[TicketResponse])
async def list_tickets(
    project_id: int,
    status: Optional[TicketStatus] = None,
    priority: Optional[TicketPriority] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print(f"[API] list_tickets called for project_id: {project_id} by user: {current_user.email}")
    try:
        query = select(Ticket).where(Ticket.project_id == project_id)
        
        if status:
            query = query.where(Ticket.status == status)
        if priority:
            query = query.where(Ticket.priority == priority)
        if search:
            query = query.where(
                (Ticket.title.ilike(f"%{search}%")) | (Ticket.description.ilike(f"%{search}%"))
            )
            
        # CRITICAL: Deep selectinload to prevent async serialization crashes
        result = await db.execute(
            query.options(
                selectinload(Ticket.assignee),
                selectinload(Ticket.attachments),
                selectinload(Ticket.comments).selectinload(Comment.author),
                selectinload(Ticket.comments).selectinload(Comment.replies)
            )
        )
        data = result.scalars().all()
        print(f"[API] Found {len(data)} tickets")
        return data
    except Exception as e:
        print(f"Error listing tickets: {str(e)}")
        # Log the full traceback internally if possible, but for now just the error
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(
    project_id: int, 
    ticket_id: int, 
    ticket_in: TicketUpdate, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id, Ticket.project_id == project_id))
    db_ticket = result.scalars().first()
    if not db_ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    
    update_data = ticket_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_ticket, key, value)
    
    db.add(db_ticket)
    await db.commit()
    
    # Reload with deep relations
    result = await db.execute(
        select(Ticket)
        .where(Ticket.id == ticket_id)
        .options(
            selectinload(Ticket.assignee),
            selectinload(Ticket.attachments),
            selectinload(Ticket.comments).selectinload(Comment.author),
            selectinload(Ticket.comments).selectinload(Comment.replies)
        )
    )
    return result.scalars().first()

@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ticket(
    project_id: int, 
    ticket_id: int, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id, Ticket.project_id == project_id))
    db_ticket = result.scalars().first()
    if not db_ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    
    await db.delete(db_ticket)
    await db.commit()
    return None

# Comment Endpoints
@router.post("/{ticket_id}/comments", response_model=CommentResponse)
async def create_comment(
    project_id: int,
    ticket_id: int,
    comment_in: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket_result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    if not ticket_result.scalars().first():
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    db_comment = Comment(
        content=comment_in.content,
        ticket_id=ticket_id,
        user_id=current_user.id,
        parent_id=comment_in.parent_id
    )
    db.add(db_comment)
    await db.commit()
    await db.refresh(db_comment)
    
    result = await db.execute(
        select(Comment)
        .where(Comment.id == db_comment.id)
        .options(selectinload(Comment.author), selectinload(Comment.replies))
    )
    return result.scalars().first()

@router.get("/{ticket_id}/comments", response_model=List[CommentResponse])
async def list_comments(
    project_id: int,
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Comment)
        .where(Comment.ticket_id == ticket_id, Comment.parent_id == None)
        .options(selectinload(Comment.author), selectinload(Comment.replies))
    )
    return result.scalars().all()

@router.post("/{ticket_id}/attachments", response_model=AttachmentResponse)
async def create_attachment(
    project_id: int,
    ticket_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file_url = f"/uploads/{file.filename}"
    db_attachment = Attachment(
        file_name=file.filename,
        file_url=file_url,
        ticket_id=ticket_id
    )
    db.add(db_attachment)
    await db.commit()
    await db.refresh(db_attachment)
    return db_attachment
