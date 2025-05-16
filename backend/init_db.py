from app.core.database import Base, engine
from app.models import user  # import tất cả các model bạn có

def init():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init()
