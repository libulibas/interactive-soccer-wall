import webview
import os
import sys

def get_base_path():
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.dirname(os.path.abspath(__file__))
    return base_path

if __name__ == '__main__':
    base_path = get_base_path()
    html_path = os.path.join(base_path, 'index.html')
    
    # Convert path to file:// URL scheme
    file_url = f"file:///{html_path.replace(os.sep, '/')}"
    
    # Create the webview window in fullscreen
    window = webview.create_window(
        'Interactive Soccer Wall', 
        url=file_url,
        fullscreen=True
    )
    
    # Start the application
    webview.start()
