import sys
sys.path.insert(0, 'C://Users//cxzx//PycharmProjects//quantum-platform')
from quantum import create_app

app=create_app()

if __name__ == '__main__':
    if app.debug:
        app.run(debug=True)
    else:
        app.run(host='0.0.0.0')