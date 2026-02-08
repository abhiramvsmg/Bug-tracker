import asyncio
import os
import sys

# Ensure the current directory is in sys.path so 'app' can be found
sys.path.append(os.getcwd())

from app.database import SessionLocal, engine
from app.models import User
from sqlalchemy import select

async def list_users():
    print("Running list_users script...")
    async with SessionLocal() as session:
        try:
            result = await session.execute(select(User))
            users = result.scalars().all()
            with open("users_list.txt", "w") as f:
                f.write(f"Found {len(users)} users:\n")
                for u in users:
                    f.write(f" - {u.email} (ID: {u.id}, Role: {u.role})\n")
            print(f"Successfully wrote {len(users)} users to users_list.txt")
        except Exception as e:
            with open("users_list.txt", "w") as f:
                f.write(f"Error: {str(e)}\n")
            print(f"Error: {e}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(list_users())
