async function mintNFT() {
    if (!account || !walletConnected) {
      mintStatus = '💀 CONNECT YOUR SOUL TO THE BLOCKCHAIN FIRST! 💀';
      return;
    }

    if (currentSupply >= maxSupply) {
      mintStatus = '🚨 ALL SCHIZO BROTHERS HAVE BEEN ADOPTED! 🚨';
      return;
    }

    const selectedPaymentToken = paymentTokens.find(
      token => token.symbol === selectedToken
    );
    if (!selectedPaymentToken) {
      mintStatus = '🤖 ERROR: PAYMENT METHOD FROM ANOTHER DIMENSION!';
      return;
    }
    
    isMinting = true;
    mintStatus = `🛸 PREPARING MULTICALL SACRIFICE... 🛸`;

    try {
      // This array will hold all the calls for our multicall transaction.
      const calls: Call[] = [];

      // Connect the contract to the account for populating calls.
      contract.connect(account);

      // Step 1: Handle token approval if necessary (not for ETH).
      // For STRK and other ERC20s, we check allowance and add an `approve` call if needed.
      if (selectedToken !== 'ETH') {
        mintStatus = `🔐 CHECKING ${selectedToken} PERMISSIONS...`;

        const erc20Contract = new Contract(
          ERC20_ABI,
          selectedPaymentToken.address,
          account 
        );

        // Use BigInt for price calculations to avoid precision loss.
        const priceAmount =
          BigInt(parseFloat(selectedPaymentToken.price)) *
          BigInt(10 ** selectedPaymentToken.decimals);
        
        // Fetch and correctly parse u256 balance.
        const balanceBN = await erc20Contract.balance_of(walletAddress);
        const balance = BigInt(balanceBN.balance.low) + (BigInt(balanceBN.balance.high) << 128n);

        if (balance < priceAmount) {
           throw new Error(`Insufficient ${selectedToken} balance.`);
        }

        // Fetch and correctly parse u256 allowance.
        const allowanceBN = await erc20Contract.allowance(
          walletAddress,
          COLLECTION_CONFIG.CONTRACT_ADDRESS
        );
        const currentAllowance = BigInt(allowanceBN.allowance.low) + (BigInt(allowanceBN.allowance.high) << 128n);

        // If allowance is insufficient, add the approve call to the multicall array.
        if (currentAllowance < priceAmount) {
          mintStatus = `➕ ADDING ${selectedToken} APPROVAL TO MULTICALL...`;
          calls.push(
            erc20Contract.populate('approve', [
              COLLECTION_CONFIG.CONTRACT_ADDRESS,
              priceAmount,
            ])
          );
        }
      }

      // Step 2: Add the mint call to the multicall array.
      mintStatus = '➕ ADDING MINT ACTION TO MULTICALL...';
      calls.push(
        contract.populate('mint', [
          1, // quantity
          selectedPaymentToken.address,
        ])
      );

      // Step 3: Execute the multicall transaction.
      mintStatus = '✍️ SIGN THE UNIFIED TRANSACTION TO SUMMON YOUR BROTHER...';
      const tx = await account.execute(calls);

      mintStatus = '⚡️ TRANSACTION LAUNCHED INTO THE BLOCKCHAIN MATRIX! ⚡️';
      showTransactionHashPopup(tx.transaction_hash);

      await provider.waitForTransaction(tx.transaction_hash, {
        retryInterval: 2000,
        successStates: ['ACCEPTED_ON_L1', 'ACCEPTED_ON_L2'],
      });

      lastMintedId = currentSupply;
      isRevealed = shouldRevealNFT(lastMintedId);
      currentSupply += 1;

      mintStatus = `🎉 SCHIZO BROTHER #${lastMintedId} HAS BEEN BORN! WELCOME TO THE FAMILY! 🎉`;
      showMintingSuccessPopup(
        walletAddress,
        lastMintedId,
        selectedPaymentToken.price,
        selectedToken
      );

    } catch (error: any) {
      console.error('Multicall minting failed:', error);
      if (error.message?.includes('User rejected')) {
        mintStatus = '👻 USER REJECTED! The ritual was cancelled.';
      } else if (error.message?.includes('Insufficient')) {
         mintStatus = `💰 ${error.message}`;
      }
      else {
        mintStatus = `💥 THE SIMULATION GLITCHED! Error: ${error.message || 'Unknown error'}`;
      }
    } finally {
      isMinting = false;
    }
  }
