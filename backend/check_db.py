import asyncio
import os
from sqlalchemy import select
from app.database import SessionLocal, engine, DATABASE_URL
from app.models import User

async def check_db():
    print(f"Connecting to: {DATABASE_URL}")
    try:
        async with SessionLocal() as session:
            result = await session.execute(select(User))
            users = result.scalars().all()
            print(f"Found {len(users)} users:")
            for u in users:
                print(f" - {u.email} (ID: {u.id}, Role: {u.role})")
    except Exception as e:
        print(f"Error connecting to database: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_db())
