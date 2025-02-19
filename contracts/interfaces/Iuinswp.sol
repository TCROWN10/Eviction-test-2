// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IUniswapV3Factory {
    event PoolCreated(
        address indexed token0,
        address indexed token1,
        uint24 fee,
        address pool
    );

    function getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (address pool);

    function owner() external view returns (address);

    function setOwner(address _owner) external;
}
