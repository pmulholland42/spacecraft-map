## Setup

### Dependencies

- Python 3
- npm

### Backend

1. Navigate to the `backend` folder in the project root folder.
1. Run `python3 -m venv env` to create a new python virtual environment.
1. Run `source env/bin/activate` on Linux/Mac or `.\env\Scripts\activate.bat` on Windows to start the new virtual environment.
1. Run `pip install -r requirements.txt` to install dependencies.
1. Create Django environment file: create a new file called `.env` under the `backend/backend` folder. The contents of this file should be `SECRET_KEY = 'secretkeyhere'`. See [this guide](https://humberto.io/blog/tldr-generate-django-secret-key/) for details on generating this key.
1. Run `python manage.py migrate` to update the database.

### Frontend

1. Navigate to the `frontend` folder.
1. Run `npm install` to install dependencies.
1. Optional: populate the `frontend/public/images/photos` folder with images of the planets. These photos are copyrighted so they're not checked into source control.

## Running the app

### Backend

1. Navigate to the `backend` folder in the project root folder.
1. Run `source env/bin/activate` on Linux/Mac or `.\env\Scripts\activate.bat` on Windows to start the virtual environment.
1. Run `python manage.py runserver` to start the server.
1. When done, run `deactivate` to stop using the virtual environment.

### Frontend

1. Navigate to the `frontend` folder.
1. Run `npm run start` to start the app in development mode.
1. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Alternatively, you can build the app in production mode:

1. Run `npm run build` to build the app into the `build` folder.
2. To serve the app, you can use any server software. For example with the [npm serve package](https://www.npmjs.com/package/serve) package (`npm install -g serve`), you can run `serve -s build`.
