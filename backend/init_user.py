import asyncio
from sqlalchemy import select
from app.database import SessionLocal, engine
from app.models import User, UserRole
from app.auth.utils import get_password_hash

async def init_user():
    async with SessionLocal() as session:
        # Check if user exists
        result = await session.execute(select(User).where(User.email == "abhiram@gmail.com"))
        user = result.scalars().first()
        
        if not user:
            print("Creating user abhiram@gmail.com...")
            new_user = User(
                email="abhiram@gmail.com",
                hashed_password=get_password_hash("password123"),
                full_name="Abhiram",
                role=UserRole.ADMIN
            )
            session.add(new_user)
            await session.commit()
            print("User created successfully with password: password123")
        else:
            print("User abhiram@gmail.com already exists.")
            # Update password just in case
            user.hashed_password = get_password_hash("password123")
            await session.commit()
            print("Password updated to: password123")
            
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_user())
