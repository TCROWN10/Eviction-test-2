// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IUniswapV3Router {
    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        bytes calldata path,
        address to,
        uint deadline
    ) external returns (uint amountOut);

    function swapExactETHForTokens(
        uint amountOutMin,
        bytes calldata path,
        address to,
        uint deadline
    ) external payable returns (uint amountOut);
}

interface INonfungiblePositionManager {
    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function mint(
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint amount0Desired,
        uint amount1Desired,
        uint amount0Min,
        uint amount1Min,
        address recipient,
        uint deadline
    ) external returns (uint tokenId, uint128 liquidity, uint amount0, uint amount1);

    function decreaseLiquidity(
        uint tokenId,
        uint128 liquidity,
        uint amount0Min,
        uint amount1Min,
        uint deadline
    ) external returns (uint amount0, uint amount1);

    function collect(
        uint tokenId,
        address recipient,
        uint128 amount0Max,
        uint128 amount1Max
    ) external returns (uint amount0, uint amount1);
}
