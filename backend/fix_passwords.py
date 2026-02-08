import asyncio
import os
import sys
sys.path.append(os.getcwd())
from app.database import SessionLocal, engine
from app.models import User
from app.auth.utils import get_password_hash
from sqlalchemy import select

async def fix_passwords():
    password = "password123"
    hashed = get_password_hash(password)
    print(f"--- RESETTING ALL PASSWORDS TO '{password}' ---")
    async with SessionLocal() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        for user in users:
            print(f"Resetting password for: {user.email}")
            user.hashed_password = hashed
        await session.commit()
    print("SUCCESS: All passwords reset to 'password123'")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(fix_passwords())
