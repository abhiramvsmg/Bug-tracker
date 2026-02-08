from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from .models import UserRole, TicketStatus, TicketPriority, TicketType

# Auth Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.MEMBER

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Workspace Member Schemas
class MemberAdd(BaseModel):
    email: EmailStr

# Workspace Schemas
class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceResponse(WorkspaceBase):
    id: int
    created_at: datetime
    owner_id: int
    members: List[UserResponse] = []

    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    workspace_id: int
    image_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Comment Schemas
class CommentBase(BaseModel):
    content: str
    ticket_id: int
    parent_id: Optional[int] = None

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    user_id: int
    created_at: datetime
    author: UserResponse
    replies: List["CommentResponse"] = []

    class Config:
        from_attributes = True

# Attachment Schemas
class AttachmentBase(BaseModel):
    file_name: str
    file_url: str
    ticket_id: int

class AttachmentResponse(AttachmentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Ticket Schemas
class TicketBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: TicketStatus = TicketStatus.BACKLOG
    priority: Optional[TicketPriority] = TicketPriority.MEDIUM
    ticket_type: Optional[TicketType] = TicketType.BUG
    project_id: int
    assignee_id: Optional[int] = None

class TicketCreate(TicketBase):
    pass

    @field_validator('status', 'priority', 'ticket_type', mode='before')
    @classmethod
    def normalize_enums(cls, v):
        if isinstance(v, str):
            return v.lower()
        return v

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    ticket_type: Optional[TicketType] = None
    assignee_id: Optional[int] = None

    @field_validator('status', 'priority', 'ticket_type', mode='before')
    @classmethod
    def normalize_enums(cls, v):
        if v is None:
            return v
        if isinstance(v, str):
            return v.lower()
        return v

class TicketResponse(TicketBase):
    id: int
    created_at: datetime
    updated_at: datetime
    assignee: Optional[UserResponse] = None
    comments: List[CommentResponse] = []
    attachments: List[AttachmentResponse] = []

    class Config:
        from_attributes = True

# Refresh forward references for CommentResponse
CommentResponse.model_rebuild()
