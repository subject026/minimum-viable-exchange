// deploy/00_deploy_balloons_dex.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("Balloons", {
    from: deployer,
    log: true,
  });

  const balloons = await ethers.getContract("Balloons", deployer);

  await deploy("DEX", {
    from: deployer,
    args: [balloons.address],
    log: true,
  });

  const dex = await ethers.getContract("DEX", deployer);

  // paste in your address here to get 1 balloons on deploy:
  // await balloons.transfer(deployer, "" + 1 * 10 ** 18);

  const deployerBalloons = await balloons.balanceOf(deployer);
  console.log(
    "deployerBalloons balance: ",
    ethers.utils.formatUnits(deployerBalloons)
  );
  const deployerETH = await ethers.provider.getBalance(deployer);
  console.log("deployerETH balance: ", ethers.utils.formatUnits(deployerETH));
  // uncomment to init DEX on deploy:
  console.log(
    "Approving DEX (" + dex.address + ") to take Balloons from main account..."
  );
  // If you are going to the testnet make sure your deployer account has enough ETH
  await balloons.approve(dex.address, ethers.utils.parseEther("100"));
  // console.log("INIT exchange...");
  await dex.init("" + 0.3 * 10 ** 18, {
    value: ethers.utils.parseEther("0.3"),
    gasLimit: 200000,
  });
};
module.exports.tags = ["Balloons", "DEX"];
