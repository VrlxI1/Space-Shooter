import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

PORT = 8000
GAME_FILE = "space_shooter.html"

def launch_game():
    """Start the web server and open the game in the browser."""
    

    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    

    if not Path(GAME_FILE).exists():
        print(f"Error: {GAME_FILE} not found in {script_dir}")
        return
    

    Handler = http.server.SimpleHTTPRequestHandler
    
    print(f" Starting Space Shooter Game Server...")
    print(f" Serving files from: {script_dir}")
    print(f" Server running at: http://localhost:{PORT}")
    print(f" Opening game in your browser...")
    print(f"\nPress Ctrl+C to stop the server\n")
    

    webbrowser.open(f"http://localhost:{PORT}/{GAME_FILE}")
    

    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n Server stopped. Thanks for playing!")
    except OSError as e:
        if e.errno == 98:  
            print(f"\n Port {PORT} is already in use.")
            print(f" Try opening http://localhost:{PORT}/{GAME_FILE} in your browser")
            print("   Or change the PORT variable in this script")
        else:
            raise

if __name__ == "__main__":
    launch_game()