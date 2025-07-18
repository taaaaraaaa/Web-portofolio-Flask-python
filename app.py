from flask import Flask, request, jsonify, render_template
import os
import socket

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({'message': 'Semua field wajib diisi!'}), 400

    with open('messages.txt', 'a', encoding='utf-8') as f:
        f.write(f"Nama: {name}\nEmail: {email}\nPesan: {message}\n---\n")

    return jsonify({'message': 'Pesan berhasil dikirim. Terima kasih!'}), 200

if __name__ == '__main__':
    # Dapatkan IP lokal
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    print(f"Server Flask berjalan di: http://{local_ip}:8080")

    # Jalankan server di semua IP lokal (LAN) pada port 8080
    app.run(host='0.0.0.0', port=8080, debug=True)
