
const { ethers, JsonRpcProvider } = require("ethers");

const localProvider = new JsonRpcProvider(
  "http://localhost:8545"
);

export const getProvider = () => {
  return localProvider;
};

export const getSigner = async (index = 0) => {
  const provider = getProvider();
  const signer = await provider.getSigner(index);
  return signer;
};

export const getContract = async (address, abi, signerIndex) => {
  const signer = await getSigner(signerIndex);
  const contract = new ethers.Contract(address, abi, signer);
  return contract;
};