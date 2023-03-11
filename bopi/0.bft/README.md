# 0.bft

> Read every word if you decide to test. These will be worthless.

The bft BOP describes is a simple experimental protocol to describe how to manage Fungible Tokens.

> A lot of this document is inspired by the [brc-20 experiment](https://domo-2.gitbook.io/brc-20-experiment/).
> The idea is to explore if fees and block space can be optimized with data structures lighter than json.
> I also want to explore inscribing protocols details on-chain.

Just like the brc-20 experiment:
  - BOP and BFT should by no means be considered THE standards for anything.
  - I believe it can be improved, or forgotten for something better.
  - Or maybe it's a bad idea.
  - This is a dynamic experiment, and I strongly discourage any financial decisions to be made on the basis of its design.
  - Contributation and ideas here on GitHub or @ me on [Twitter](https://twitter.com/cohars).

## Inscription #420142

2575466c50a2137ac12b8cfb55e38609018264cbb9b1b0091c56c8992b7d1917i0

## Content

```
#d.0.bft.
  0:deploy&uint:id,word:name,uint:?max,[uint:duration-in-blocks,uint:mint-limit][]:?limits|
  1:mint&uint:id,uint:?amount|
  2:!tranfert&uint:id,uint:amount,addr:?to
```

### `deploy`

- `id` is the BFT unique identifier in the form of a unsigned integer (first is first to reserve an ID).
- `name` is an word (alphanumeric and -_) used as a frientdly identifier for this FT (first is first to reserve a names)
- `?max` is in uint (can include power of ten notation with `e`, exemple: `1e3` = `1000`)
- `?limits` is a list of `[duration-in-blocks, mint-limit]` pair describing the mint limits that can change in time.

Exemples for the `limit` parameter: 
- `[[42, 1000], [43, 0]]`: the limit is `1000` tokens for the first `42` blocks after deploy and then it's `0`.
- `[[,500]]`: no duration is provided, limit is `1000` for ever (until max supply is reached).
- See the [`idro` implementation](#idro) below for an other exemple.

### `mint`

- `id` the BFT unique identifier.
- `?amount` is an optional uint. If ignored, the maximal is applied based on limits and block-height.

If the `amount` (explicit or default) exceeds the maximum supply, the transaction is ignored.

### `!transfert`

Note: yep, there's an immutable typo in the inscription. It doesn't matter for 2 reasons:
1. This is just an experiment
1. Function are called by there id (`2` for `transfert`), not by there name

- `id` the BFT unique identifier
- `amount` amount to transfer
- `?to` address receiving the amount, if specified, it's used as a safety check

If the address inscribing this command doesn't have enough supply, the inscription is ignored.  
Once inscribed, the `!transfert` inscription has to be transferred to the address receiving the amount.  
If the `?to` argument is specified, it has to match the receiving address, otherwise, the transfer is ignored.  


Notes:

- In the event of two balance changing events happening within the same block the one with the higher fee is prioritized


---

## Implementation exemple

### idro

This is the first BFT deployed.  
**`idro` has the ID `0`**

Inscription 420417, abf461b9b5c7b8302f439da830109c5642b64b49867ba9b737f424bd4cf2b3f7i0

The maximum supply is 21e12 (21000000000000) tokens. The mint limit per ordinal starts as 2048 and is divided by 2 every 144 blocks since deployement of the `idro` toke? 

```
#c.0.0&
  0,
  idro,
  21e12,
  [
    [144, 2048],
    [288, 1024],
    [432, 512],
    [576, 256],
    [720, 128],
    [864, 64],
    [1008, 32],
    [1152, 16],
    [1296, 8],
    [1440, 4],
    [1584, 2],
    [1728, 1]
  ]
```
 
Or short version: 
```
#c.0.0&0,idro,21e12,[[144,2048],[288,1024],[432,512],[576,256],[720,128],[864,64],[1008,32],[1152,16],[1296,8],[1440,4],[1584,2],[1728,1]]
```

#### Mint `idro`

Mint the maximum authorized quantity of `idro`s.
```
#c.0.1&0
```

Mint a specific quantity:
  - If the maximum supply of `idro`s have already been minted, this will be ignored.
  - If the amount exceeds the limit (based on the block height), this will be ignored.
```
#c.0.1&0,10
```

#### Transfer `idro` 

Transfer 100 `idro` to the address this inscription will be transferred to:
```
#c.0.2&0,100
```
