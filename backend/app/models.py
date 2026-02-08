from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, Table
from sqlalchemy.orm import relationship, backref
from datetime import datetime
import enum
from .database import Base

class UserRole(enum.Enum):
    ADMIN = "admin"
    DEVELOPER = "developer"
    VIEWER = "viewer"
    MEMBER = "member"

class TicketStatus(enum.Enum):
    BACKLOG = "backlog"
    IN_PROGRESS = "in_progress"
    DONE = "done"

class TicketPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class TicketType(enum.Enum):
    BUG = "bug"
    TASK = "task"
    FEATURE = "feature"

workspace_members = Table(
    "workspace_members",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("workspace_id", Integer, ForeignKey("workspaces.id"), primary_key=True),
    Column("joined_at", DateTime, default=datetime.utcnow)
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.MEMBER)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owned_workspaces = relationship("Workspace", back_populates="owner")
    collaborated_workspaces = relationship("Workspace", secondary=workspace_members, back_populates="members")
    assigned_tickets = relationship("Ticket", back_populates="assignee")
    comments = relationship("Comment", back_populates="author")

class Workspace(Base):
    __tablename__ = "workspaces"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="owned_workspaces")
    members = relationship("User", secondary=workspace_members, back_populates="collaborated_workspaces")
    projects = relationship("Project", back_populates="workspace", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    workspace = relationship("Workspace", back_populates="projects")
    tickets = relationship("Ticket", back_populates="project", cascade="all, delete-orphan")

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(Enum(TicketStatus), default=TicketStatus.BACKLOG)
    priority = Column(Enum(TicketPriority), default=TicketPriority.MEDIUM)
    ticket_type = Column(Enum(TicketType), default=TicketType.BUG)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project", back_populates="tickets")
    assignee = relationship("User", back_populates="assigned_tickets")
    comments = relationship("Comment", back_populates="ticket", cascade="all, delete-orphan")
    attachments = relationship("Attachment", back_populates="ticket", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("Ticket", back_populates="comments")
    author = relationship("User", back_populates="comments")
    # Using a string reference for remote_side to be safe with name resolution
    replies = relationship("Comment", backref=backref("parent", remote_side="Comment.id"), cascade="all, delete-orphan")

class Attachment(Base):
    __tablename__ = "attachments"
    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("Ticket", back_populates="attachments")
