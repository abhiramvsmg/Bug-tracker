import asyncio
import os
import sys
import traceback
from sqlalchemy import select

# Ensure the current directory is in sys.path so 'app' can be found
sys.path.append(os.getcwd())

from app.database import SessionLocal, engine
from app.models import User
from app.auth.utils import verify_password, get_password_hash

async def debug_auth():
    with open("auth_debug_log.txt", "w") as f:
        f.write("Checking login for abhiram@gmail.com\n")
        try:
            async with SessionLocal() as session:
                f.write("Session opened\n")
                result = await session.execute(select(User).where(User.email == "abhiram@gmail.com"))
                user = result.scalars().first()
                if user:
                    f.write(f"Found user: {user.email}\n")
                    f.write(f"Hashed password in DB: {user.hashed_password}\n")
                    try:
                        is_valid = verify_password("password123", user.hashed_password)
                        f.write(f"Password verification result: {is_valid}\n")
                    except Exception as ve:
                        f.write(f"Error during verify_password: {str(ve)}\n")
                        f.write(traceback.format_exc())
                    
                    f.write("Generating new hash for verification...\n")
                    new_hash = get_password_hash("password123")
                    f.write(f"New hash: {new_hash}\n")
                    is_valid_new = verify_password("password123", new_hash)
                    f.write(f"Is brand new hash valid? {is_valid_new}\n")
                else:
                    f.write("User abhiram@gmail.com not found in DB\n")
        except Exception as e:
            f.write(f"General error: {str(e)}\n")
            f.write(traceback.format_exc())
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(debug_auth())
