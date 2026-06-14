#!/bin/bash

alembic upgrade head || exit 1
exec "$@"
