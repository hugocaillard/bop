# bitcoin ordinals protocols

> Read every word if you decide to test. These will be worthless.

BOP is an experimental standard to describe an use protocols on Bitcoin with Ordinals.

> A lot of this document is inspired by the [brc-20 experiment](https://domo-2.gitbook.io/brc-20-experiment/). The idea is to explore if some fees and block space can be save with data structure more optimized than json.

Just like the brc-20 experiment:
  - BOP should by no means be considered THE standard for anything.
  - I believe it can be improved, or forgotten for something better.
  - Or maybe it's a bad idea.
  - This is a dynamic experiment, and I strongly discourage any financial decisions to be made on the basis of its design.
  - Contributation and ideas here on GitHub or @ me on [Twitter](https://twitter.com/cohars).

---

## Describe a BOP (the FakeFT example)

A BOP is fundamentally described by an ID and a Name.
The following inscription describes the protocol `fakeft` (fake fungible token) with the BOP ID `42`.

```
#d.42.fakeft
```
/!\ *This is just an example, do not inscribe it*

The `#d.` command is used to describe/declare/deploy (dibs?) an ID and a Name. 
The mean that once this is inscribed, futures inscriptions declaring a BOP with the ID `42` **or** with the name `fakeft` will be ignored.

Additionally, the protocol declaration can include text to describe the protocols and the functions it exposes. This data is optional and only gives general guidances on how to use a BOP.

This `fakeft` protocol example will describe 3 functions: `deploy`, `mint` and `transfert`, that will accept certain types of parameters.

```
#d.42.fakeft.
  0:deploy& uint:id, word:name, uint:?max, uint:?limit |
  1:mint& uint:id, uint:?amount |
  2:!tranfert& uint:id, uint:amount, addr:?to
```
/!\ *This is just an example, do not inscribe it*

- `deploy` accepts 4 parameters
  - an `uint` (unsigned integer), the ID of the *fakeft* to deploy
  - a `word` (lowercase alphanumeric characters and _-), the name of the *fakeft*
  - an optional `uint`, the max supply
  - an optional `uint`, the mint limit per ordinals
- `mint` accepts 2 parameters
  - an `uint`, the ID of the *fakeft* to mint
  - an optional `uint`, the quantity to mint, the `limit` will be used if this parameter is omitted
- `transfert` accepts 3 parameters
  - an `uint`, the ID of the *fakeft*
  - a `word` (lowercase alphanumeric characters and _-), the name of the *fakeft*
  - an optional `addr`, the receiving address

Note: see the `!` in `2:!transfert`? It means that this inscription has to be transferred to be effective. In this case, the address it is transferred to will get the supply of *fakeft*. The optional parameter `addr:?to` can be used a safety check for this transfert.

## Call a BOP

Once this fake FT protocol is deployed, it can be called by inscribing function calls with the `#c.` command.

Note: All inscriptions calling a BOP ID not described in a previous block (with `#d.`) will be ignored.

### Deploy

First, let's deploy a fake fungible token called *doge* (or "DOGE" the BOP standard is case insensitive).
Let's inscribe the instructions to call the function `deploy` of the *fakeft* BOP:

```
#c.42.0& 0, doge, 21000, 10
```
/!\ *This is just an example, do not inscribe it*

- `42` is the BOP ID of the `fakeft` protocol.
- `0` is Function ID of the `deploy` function on the `fakeft` protocol.

We just deployed the `doge` FT, it has the id `0`, a max supply of `21000` doges and people can mint `10` doges per inscription. Let mint it!

### Mint

Inscribe the authorized limit (if supply is still available).
The argument `0` is passed to mint the *fakeft* with ID `0` (doge in this example).

```
#c.42.1& 0
```
/!\ *This is just an example, do not inscribe it*

### Transfert

Transfert 10 doges.
Assuming that the address inscribing this has at least 10 doges.

```
#c.42.2& 0, 10
```
/!\ *This is just an example, do not inscribe it*

---

## General syntax

### Describe a BOP

Here is the syntax to **describe** a BOP, with the command `#d.`:

Notes:
- `<>` means "to be replaced"
- whitespaces (line-breaks, spaces and tabs) are not significant but can help with readability.

```
#d.<uint:id>.<word:name>.
  0.<word:function0-name>& <type-arg0>:<name-arg0>, <...>, <type-argN>:<name-argN> |
  1.<word:function1-name>& <type-arg0>:<name-arg0>, <...>, <type-argN>:<name-argN> |
  <...>
  N.<word:functionN-name>& <type-arg0>:<name-arg0>, <...>, <type-argN>:<name-argN>
```

The only required data are `id` and `name`.  
Things gets interesting when the protocol describes the functions it exposes:
  - it give guidance on how to use a protocol,
  - it could allow to automatically generate HTML forms to call any BOP.

Most of the BOP logic rely on a first-is-first principal, meaning, an inscription will be often tied to the first address inscribing it and transfert are ignored.  
**So if you use an inscription service that mints to itself before sending the inscription to you, the inscription service will be the rightful owner of the tokens.**

**Trasnfers** can have meaning, the function modifier `!` can be used to make it explicit.


#### Types

Note: more types should be added

- `int`: integer
- `uint`: unsigned integer
- `word`: alphanumeric string including `letters`, `numbers`, `-` and `_`
- `addr`: a taproot address

#### Lists and tuples:

- `<type>[]`: a **list** of `types`, for instance `uint[]`
- `[<type1>, <...>, <typeN>]`: a **tuple**, for instance `


#### Type Modifiers

The `<type>:` notation allows to describe more precisely how a type should behave:

- `:?`: marks the type as optional
- `:<name>`: name of the type, names can contains `letters`, `numbers`, `-` and `_`

Modifiers can be combined, here is an optional uint named "id": `uint:?id`.


### Call a BOP function

Here is the syntax to **call** a BOP function, with the command `#c.`:
(Note: `<>` means "to be replaced")

```
#c.<uint:bop-id>.<uint.function-id>& <arg1>, <arg2>, <...>, <argN>
```

- If an argument is optional, it can be omitted by having nothing between 2 commas.
- Trailing commas at the end of a funcction call be omitted.
