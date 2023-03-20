# 85.bft-swap

> Read every word if you decide to test. These will be worthless.

The bft BOP is a simple experimental protocol to describe how to swap 0.bft Fungible Tokens

- BOP, BFT and SWAP-BFT should by no means be considered THE standards for anything.
- I believe it can be improved, or forgotten for something better.
- Or maybe it's a bad idea.
- This is a dynamic experiment, and I strongly discourage any financial decisions to be made on the basis of its design.
- Contributation and ideas here on GitHub or @ me on [Twitter](https://twitter.com/cohars).

## Inscription #

Not inscribed yet (afaik)

...

## Content

```
#d.85.swap-bft.
  0.!create& word:id, uint:offer-bft-id, uint:request-bft-id, uint:amount, uint:for, uint:?valid-during-blocks, uint:?valid-until-block / (0.2& <offer-bft-id>, <amount>)
  1.!accept& word:id / (0.2&<request-bft-id>, <for>)
```

## Swap flow

Assuming the two following BFTs have been deployed:
- the ANS token: `42.ans`
- the PI token: `314.pi`

Assuming that *addr1* has plenty of ANS and *addr2* has plenty of PI.

*addr1* wants to swap 1 ANS for 50 PI. It can inscribe a call to the create (0) function:
```
#c.85.0& uniq-random-id, 42, 314, 1, 50 / (0.2& 42, 1)
```

*addr2* is willing to take this swap. It can inscribe a call to the accept (1) function:
```
#c.85.1& uniq-random-id / (0.2& 314, 50)
```

Once both inscriptions have been inscribed it has to be validated, to do so,
- *addr1* should send its `create` inscription to *addr2*
- *addr2* should send its `accept` inscription to *addr1*
- indexers can now check the validity of the swap (block height and balances)
- swap is approved and the composed functions calls are applied


Note: this flow doesn't really work at the moment because it means that to compute the balances of 0.bft tokens, this protocol has to be watch and indexed as well.
So 0.bft depends on 85.bft-swap, but it should be the opposite, that's to explore.
Prob need an intermediary address
Need to think more about function call composition and if it can be a thing
