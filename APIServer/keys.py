from flask import Flask, request, jsonify
from collections import defaultdict
import uuid
from flask_cors import CORS
import generate

from web3 import Web3

# Replace with your Ethereum node's URL
w3 = Web3(Web3.HTTPProvider('https://rpc.ankr.com/eth_goerli'))

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

user_tokens = defaultdict(list)

def is_valid_transaction(transaction_hash, contract_address):
    tx = w3.eth.getTransaction(transaction_hash)
    if not tx:
        return False

    tx_receipt = w3.eth.getTransactionReceipt(transaction_hash)
    if not tx_receipt or tx_receipt['status'] != 1:
        return False

    # Check if the transaction is sent to the contract address and has the correct value (0.001 ETH)
    return tx['to'].lower() == contract_address.lower() and tx['value'] == w3.toWei('0.001', 'ether')

@app.route('/api/keys/purchase', methods=['POST'])
def purchase_keys():
    address = request.get_json().get('address')
    transaction_hash = request.get_json().get('transaction_hash')
    if not address or not transaction_hash:
        return jsonify({'error': 'Invalid address or transaction hash'}), 400

    if not is_valid_transaction(transaction_hash, contractAddress):
        return jsonify({'error': 'Invalid or unconfirmed transaction'}), 400

    for _ in range(10):
        user_tokens[address].append(str(uuid.uuid4()))

    return jsonify({'balance': len(user_tokens[address])})

@app.route('/api/keys/balance', methods=['GET'])
def get_balance():
    address = request.args.get('address')
    if not address:
        return jsonify({'error': 'Invalid address'}), 400

    return jsonify({'balance': len(user_tokens[address])})

@app.route('/generate', methods=['POST'])
def generate_image():
    prompt = request.json.get('prompt')
    address = request.get_json().get('address')

    print("Request JSON:", request.json)
    print("Prompt:", prompt)
    print("Address:", address)
    print("User tokens:", user_tokens) # Add this line

    if not address:
        return jsonify({'error': 'Invalid address'}), 400

    if not user_tokens[address]:
        return jsonify({'error': 'No token keys available'}), 400

    try:
        user_tokens[address].pop(0)
        # Replace 'generate.main()' with the correct function call from your generate module
        generated_image_url = generate.main(prompt)
        return jsonify({'imageUrl': generated_image_url, 'balance': len(user_tokens[address])})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

