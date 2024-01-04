const { ethers } = require("ethers");
const { Contract } = ethers

const localProvider = new ethers.providers.JsonRpcProvider()

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
  const contract = new Contract(address, abi, signer);
  return contract;
};