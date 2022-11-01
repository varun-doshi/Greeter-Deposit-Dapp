import { useState, useEffect } from "react";
import { ethers } from "ethers";

function App() {
  const [greet, setGreet] = useState("");
  const [balance, setBalance] = useState();
  const [greetingValue, setGreetingValue] = useState("");
  const [depositValue, setDepositValue] = useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractABI = [
    {
      inputs: [
        {
          internalType: "string",
          name: "_greeting",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "greet",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_greeting",
          type: "string",
        },
      ],
      name: "setGreeting",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const myContract = new ethers.Contract(contractAddress, contractABI, signer);

  useEffect(() => {
    const connectWallet = async () => {
      await provider.send("eth_requestAccounts", []);
      console.log("Connected");
    };

    const getBalance = async () => {
      const balance = await provider.getBalance(contractAddress);
      const formattedBalance = ethers.utils.formatEther(balance);
      console.log(formattedBalance);

      setBalance(formattedBalance);
    };

    const getGreeting = async () => {
      const greeting = await myContract.greet();
      setGreet(greeting);
    };

    connectWallet().catch(console.error);

    getBalance().catch(console.error);

    getGreeting().catch(console.error);
  }, []);

  const handleDepositChange = (e) => {
    setDepositValue(e.target.value);
  };
  const handleGreetingChange = (e) => {
    setGreetingValue(e.target.value);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const ethValue = ethers.utils.parseEther(depositValue);
    const depositEth = await myContract.deposit({ value: ethValue });
    await depositEth.wait();
    const balance = await provider.getBalance(contractAddress);
    const formattedBalance = ethers.utils.formatEther(balance);
    setBalance(formattedBalance);
    setDepositValue(0);
  };
  const handleGreetingSubmit = async (e) => {
    e.preventDefault();
    await myContract.setGreeting(greetingValue);
    setGreet(greetingValue);
    setGreetingValue("");
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col">
          <h3>{greet}</h3>
          <p>Contract Balance: {balance} ETH</p>
        </div>

        <div className="col">
          <div className="mb-3">
            <h4>Deposit ETH</h4>
            <form onSubmit={handleDepositSubmit}>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="0 ETH"
                  onChange={handleDepositChange}
                  value={depositValue}
                />
              </div>
              <button type="submit" className="btn btn-success">
                Deposit
              </button>
            </form>

            <h4 className="mt-3">Change Greeting</h4>
            <form onSubmit={handleGreetingSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  onChange={handleGreetingChange}
                  value={greetingValue}
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Change
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
