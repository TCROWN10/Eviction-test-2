import { ethers } from "hardhat";
import { BigNumber } from "ethers";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

async function main() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const deadline = currentTimestampInSeconds + 86400;

    const NONFUNGIBLE_POSITION_MANAGER = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
    const UNISWAP_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
    const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const HOLDER = "0x2933782B5A8d72f2754103D1489614F29bfA4625";

    // Impersonate the holder
    await helpers.impersonateAccount(HOLDER);
    const impersonatedHolder = await ethers.getSigner(HOLDER);

    const positionManager = await ethers.getContractAt(
        "INonfungiblePositionManager",
        NONFUNGIBLE_POSITION_MANAGER
    );

    const usdt = await ethers.getContractAt("IERC20", USDT);
    const dai = await ethers.getContractAt("IERC20", DAI);

    const amountADesired = ethers.parseEther("20");
    const amountBDesired = ethers.parseEther("20");
    const approveAmt = ethers.parseEther("100000");

    console.log("========== Approving tokens ==========");
    await usdt.connect(impersonatedHolder).approve(NONFUNGIBLE_POSITION_MANAGER, approveAmt);
    await dai.connect(impersonatedHolder).approve(NONFUNGIBLE_POSITION_MANAGER, approveAmt);
    console.log("========== Tokens Approved ==========");

    console.log("========== Adding liquidity ==========");
    const addLiquidityTx = await positionManager.connect(impersonatedHolder).mint(
        USDT, 
        DAI, 
        3000, 
        -887220, 
        887220, 
        amountADesired, // amount0Desired
        amountBDesired, 
        0, // amount0Min
        0, // amount1Min
        HOLDER, // recipient
        deadline // deadline
    );
    await addLiquidityTx.wait();
    console.log("========== Liquidity Added ==========");

    console.log("========== Fetching position ID ==========");
    const balance = await positionManager.balanceOf(HOLDER);
    if (balance.eq(0)) {
        console.log("No liquidity position found.");
        return;
    }

    const tokenId = await positionManager.tokenOfOwnerByIndex(HOLDER, 0);
    console.log("Position ID:", tokenId.toString());

    console.log("========== Removing liquidity ==========");
    const decreaseLiquidityTx = await positionManager.connect(impersonatedHolder).decreaseLiquidity(
        tokenId, // tokenId
        ethers.parseEther("10"), // liquidity to remove
        0, // amount0Min
        0, // amount1Min
        deadline // deadline
    );
    await decreaseLiquidityTx.wait();
    console.log("========== Liquidity Removed ==========");

    console.log("========== Collecting Fees ==========");
    const collectTx = await positionManager.connect(impersonatedHolder).collect(
        tokenId, // tokenId
        HOLDER, // recipient
        ethers.MaxUint128, // amount0Max
        ethers.MaxUint128 // amount1Max
    );
    await collectTx.wait();
    console.log("========== Fees Collected ==========");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});