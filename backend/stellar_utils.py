from stellar_sdk import Server, Keypair, TransactionBuilder, Network
import requests

server = Server("https://horizon-testnet.stellar.org")
network_passphrase = Network.TESTNET_NETWORK_PASSPHRASE

def create_wallet():
    keypair = Keypair.random()
    public_key = keypair.public_key
    secret = keypair.secret
    # Fund wallet on testnet
    requests.get(f"https://friendbot.stellar.org/?addr={public_key}")
    return public_key, secret

def fund_testnet_account(public_key):
    # This URL hits Friendbot to fund the wallet with test XLM
    url = f"https://friendbot.stellar.org/?addr={public_key}"
    response = requests.get(url)
    
    # Check if the funding was successful
    if response.status_code == 200:
        return response.json()  # Contains details about the transaction
    else:
        return {"error": "Failed to fund the account"}

def send_payment(source_secret, destination_public, amount, memo="Donation"):
    source_keypair = Keypair.from_secret(source_secret)
    source_account = server.load_account(source_keypair.public_key)
    
    tx = (
        TransactionBuilder(source_account, network_passphrase)
        .add_text_memo(memo)
        .append_payment_op(destination_public, str(amount), "XLM")
        .set_timeout(30)
        .build()
    )
    tx.sign(source_keypair)
    return server.submit_transaction(tx)
if __name__ == "__main__":
    pub, sec = create_wallet()
    print(f"Donor Wallet\nPublic: {pub}\nSecret: {sec}")

