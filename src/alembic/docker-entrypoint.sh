#!/bin/bash

set -e
alembic upgrade head
if [ "${ENVIRONMENT}" = "production" ]; then
    uvicorn admin.main:app --host 0.0.0.0 --port ${PORT:-10000}
else
    uvicorn admin.main:app --host 0.0.0.0 --port ${PORT:-8000} --reload
fi
