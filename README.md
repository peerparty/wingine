## Update repos

    $ apt update

## Add dependencies

    $ apt-get --yes install build-essential software-properties-common git curl nginx vim sudo
 
## Add geth repository

    $ add-apt-repository -y ppa:ethereum/ethereum 

## Install geth

    $ apt-get --yes install ethereum

## Clone solc repository

    $ git clone --recursive https://github.com/ethereum/solidity.git

## Install build dependencies

    $ ./install_deps.sh

## Build solc

    $ ./scripts/build.sh

## Install node.js

    $ curl -sL https://deb.nodesource.com/setup_14.x | bash 

    $ apt-get install -y nodejs

## Create Geth account

    $ geth account new

Take note of the address: 0x77DA2DBFc8f2c406dd6ca3F50701AA2ba6C567d1

## Create gethpass file

    $ echo password > gethpass

## Run puppeth

    $ puppeth

### Example puppeth session

    root@34cbf69db6b9:~# puppeth
    +-----------------------------------------------------------+
    | Welcome to puppeth, your Ethereum private network manager |
    |                                                           |
    | This tool lets you create a new Ethereum network down to  |
    | the genesis block, bootnodes, miners and ethstats servers |
    | without the hassle that it would normally entail.         |
    |                                                           |
    | Puppeth uses SSH to dial in to remote servers, and builds |
    | its network components out of Docker containers using the |
    | docker-compose toolset.                                   |
    +-----------------------------------------------------------+

    Please specify a network name to administer (no spaces, hyphens or capital letters please)
    > winwin

    Sweet, you can set this via --network=winwin next time!

    INFO [04-24|17:00:57.826] Administering Ethereum network           name=winwin
    WARN [04-24|17:00:57.826] No previous configurations found         path=/root/.puppeth/winwin

    What would you like to do? (default = stats)
     1. Show network stats
     2. Configure new genesis
     3. Track new remote server
     4. Deploy network components
    > 2

    What would you like to do? (default = create)
     1. Create new genesis from scratch
     2. Import already existing genesis
    > 1

    Which consensus engine to use? (default = clique)
     1. Ethash - proof-of-work
     2. Clique - proof-of-authority
    > 2

    How many seconds should blocks take? (default = 15)
    > 

    Which accounts are allowed to seal? (mandatory at least one)
    > 0x77DA2DBFc8f2c406dd6ca3F50701AA2ba6C567d1
    > 0x

    Which accounts should be pre-funded? (advisable at least one)
    > 0x77DA2DBFc8f2c406dd6ca3F50701AA2ba6C567d1
    > 0x

    Should the precompile-addresses (0x1 .. 0xff) be pre-funded with 1 wei? (advisable yes)
    > 

    Specify your chain/network ID if you want an explicit one (default = random)
    > 1337
    INFO [04-24|17:01:46.042] Configured new genesis block 

    What would you like to do? (default = stats)
     1. Show network stats
     2. Manage existing genesis
     3. Track new remote server
     4. Deploy network components
    > 2

     1. Modify existing configurations
     2. Export genesis configurations
     3. Remove genesis configuration
    > 2

    Which folder to save the genesis specs into? (default = current)
      Will create winwin.json, winwin-aleth.json, winwin-harmony.json, winwin-parity.json
    > 
    INFO [04-24|17:01:58.934] Saved native genesis chain spec          path=winwin.json
    ERROR[04-24|17:01:58.934] Failed to create Aleth chain spec        err="unsupported consensus engine"
    ERROR[04-24|17:01:58.934] Failed to create Parity chain spec       err="unsupported consensus engine"
    INFO [04-24|17:01:58.936] Saved genesis chain spec                 client=harmony path=winwin-harmony.json

    What would you like to do? (default = stats)
     1. Show network stats
     2. Manage existing genesis
     3. Track new remote server
     4. Deploy network components
    > ^C

## Initialize Geth

    $ geth init winwin.json 

## Start Geth

    $ geth --unlock $COINBASE --password /root/gethpass --mine --http --http.api "eth,net,web3,admin,personal" --allow-insecure-unlock --nousb --verbosity 3 --nodiscover --maxpeers 0 --networkid 1337 console

## Compile the contract

    $ solc wingine.sol --combined-json abi,bin > wingine.json

