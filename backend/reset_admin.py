import asyncio
import os
import sys
sys.path.append(os.getcwd())
from app.database import SessionLocal, engine
from app.models import User, UserRole
from app.auth.utils import get_password_hash
from sqlalchemy import delete

async def reset_admin():
    email = "admin@example.com"
    password = "adminpassword"
    print(f"--- RESETTING ADMIN ACCOUNT ---")
    async with SessionLocal() as session:
        # Delete existing if any
        await session.execute(delete(User).where(User.email == email))
        
        new_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name="System Admin",
            role=UserRole.ADMIN
        )
        session.add(new_user)
        await session.commit()
        print(f"SUCCESS: Account created.")
        print(f"EMAIL: {email}")
        print(f"PASSWORD: {password}")
        print(f"-------------------------------")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(reset_admin())
