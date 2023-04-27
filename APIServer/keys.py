from flask import Flask, request, jsonify
from collections import defaultdict
import uuid

app = Flask(__name__)

user_tokens = defaultdict(list)

@app.route('/api/keys/purchase', methods=['POST'])
def purchase_keys():
    address = request.get_json().get('address')
    if not address:
        return jsonify({'error': 'Invalid address'}), 400

    for _ in range(10):
        user_tokens[address].append(str(uuid.uuid4()))

    return jsonify({'balance': len(user_tokens[address])})

@app.route('/api/keys/balance', methods=['GET'])
def get_balance():
    address = request.args.get('address')
    if not address:
        return jsonify({'error': 'Invalid address'}), 400

    return jsonify({'balance': len(user_tokens[address])})

@app.route('/api/keys/consume', methods=['POST'])
def consume_key():
    address = request.get_json().get('address')
    if not address:
        return jsonify({'error': 'Invalid address'}), 400

    if not user_tokens[address]:
        return jsonify({'error': 'No token keys available'}), 400

    user_tokens[address].pop(0)

    return jsonify({'balance': len(user_tokens[address])})

if __name__ == '__main__':
    app.run(host='localhost', port=5000)
