from flask import Flask, redirect, request, jsonify
from stellar_utils import create_wallet, send_payment
from flask import Flask, request, jsonify
from stellar_sdk import Server, Keypair, TransactionBuilder, Network, Asset
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
server = Server("https://horizon-testnet.stellar.org")
network_passphrase = Network.TESTNET_NETWORK_PASSPHRASE
DATA_FILE = "backend/data.json"
def load_data():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

CORS(app)

nonprofits = {}

@app.route('/register-nonprofit', methods=['POST'])
def register_nonprofit():
    name = request.json.get("name")
    kp = Keypair.random()
    public_key = kp.public_key
    secret_key = kp.secret
    response = requests.get(f"https://friendbot.stellar.org/?addr={public_key}")
    nonprofits[public_key] = {
        "name": name,
        "secret": secret_key
    }

    return jsonify({
        "name": name,
        "public": public_key,
        "Secret": secret_key
    })
@app.route("/donate", methods=["POST"])




@app.route("/donate", methods=["POST"])
def donate():
    data = request.json
    donor_secret = data.get("donor_secret")
    destination_public = data.get("destination_public")
    amount = str(data.get("amount"))  # Ensure it's a string

    try:
        source_keypair = Keypair.from_secret(donor_secret)
        source_account = server.load_account(account_id=source_keypair.public_key)

        transaction = (
            TransactionBuilder(
                source_account=source_account,
                network_passphrase=network_passphrase,
                base_fee=100
            )
            .add_text_memo("Donation")
            .append_payment_op(
                destination=destination_public,
                amount=amount,
                asset=Asset.native()  # This is correct for XLM
            )
            .set_timeout(30)
            .build()
        )

        transaction.sign(source_keypair)
        response = server.submit_transaction(transaction)

        return jsonify({"success": True, "transaction": response}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400
    
@app.route("/transactions/<public_key>", methods=["GET"])
def get_transactions(public_key):
    try:
        records = server.transactions().for_account(public_key).limit(10).order(desc=True).call()["_embedded"]["records"]

        result = []
        for tx in records:
            # Load full transaction to get operations
            tx_detail = server.transactions().transaction(tx["hash"]).call()
            operations = server.operations().for_transaction(tx["hash"]).call()["_embedded"]["records"]

            for op in operations:
                if op["type"] == "payment" and op["asset_type"] == "native":
                    result.append({
                        "id": tx["hash"],
                        "from": op["from"],
                        "to": op["to"],
                        "amount": op["amount"],
                        "timestamp": tx["created_at"]
                    })

        return jsonify({"transactions": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
