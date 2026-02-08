import asyncio
import os
import sys
from sqlalchemy import text
from app.database import engine

async def check_types():
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT typname FROM pg_type WHERE typname IN ('ticketpriority', 'tickettype', 'userrole', 'ticketstatus')"))
        types = [r[0] for r in result.fetchall()]
        print(f"Existing types: {types}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_types())
