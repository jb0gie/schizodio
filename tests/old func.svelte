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

    // Debug logging to confirm the correct address is being used
    console.log('🔍 Payment Token Debug:', {
      selectedToken,
      selectedPaymentToken,
      address: selectedPaymentToken.address,
      price: selectedPaymentToken.price,
    });

    try {
      isMinting = true;
      mintStatus = `🛸 INITIATING ${selectedToken} SACRIFICE RITUAL... 🛸`;

      // Connect the contract to the account
      contract.connect(account);

      // Check if we need to approve the token first
      if (selectedToken !== 'ETH') {
        mintStatus = `🔐 CHECKING ${selectedToken} PERMISSIONS...`;

        try {
          // Create ERC20 contract instance for the payment token
          const erc20Contract = new Contract(
            ERC20_ABI,
            selectedPaymentToken.address,
            provider
          );

          // Check user's balance first
          const balance = await erc20Contract.balance_of(walletAddress);
          console.log('Raw balance response:', balance);

          // Handle different balance response structures
          let balanceValue: number;
          if (balance.balance?.value) {
            balanceValue = Number(balance.balance.value);
          } else if (balance.balance) {
            balanceValue = Number(balance.balance);
          } else if (balance.value) {
            balanceValue = Number(balance.value);
          } else {
            balanceValue = Number(balance);
          }

          console.log('User balance:', balanceValue);
          console.log(
            'User balance (human readable):',
            balanceValue / Math.pow(10, selectedPaymentToken.decimals)
          );

          // Check current allowance
          const allowance = await erc20Contract.allowance(
            walletAddress,
            COLLECTION_CONFIG.CONTRACT_ADDRESS
          );
          console.log('Raw allowance response:', allowance);

          // Convert price to proper decimals
          const priceAmount =
            parseFloat(selectedPaymentToken.price) *
            Math.pow(10, selectedPaymentToken.decimals);

          // Check if user has enough balance
          if (balanceValue < priceAmount) {
            throw new Error(
              `Insufficient balance: ${balanceValue / Math.pow(10, selectedPaymentToken.decimals)} ${selectedToken} available, ${selectedPaymentToken.price} ${selectedToken} required`
            );
          }

          // Handle u256 allowance value correctly
          let currentAllowance: number;
          if (allowance.allowance?.value) {
            currentAllowance = Number(allowance.allowance.value);
          } else if (allowance.allowance) {
            currentAllowance = Number(allowance.allowance);
          } else if (allowance.value) {
            currentAllowance = Number(allowance.value);
          } else {
            currentAllowance = Number(allowance);
          }

          console.log('Current allowance (parsed):', currentAllowance);
          console.log('Required amount:', priceAmount);

          if (currentAllowance < priceAmount) {
            mintStatus = `🔓 APPROVING ${selectedToken} SPENDING PERMISSIONS...`;

            // Approve the NFT contract to spend tokens
            console.log('Approving amount:', priceAmount.toString());
            const approveCall = erc20Contract.populate('approve', [
              COLLECTION_CONFIG.CONTRACT_ADDRESS,
              priceAmount.toString(),
            ]);

            const approveTx = await account.execute(approveCall);
            console.log(
              'Approve transaction hash:',
              approveTx.transaction_hash
            );

            // Wait for approval transaction
            await provider.waitForTransaction(approveTx.transaction_hash, {
              retryInterval: 2000,
              successStates: ['ACCEPTED_ON_L1', 'ACCEPTED_ON_L2'],
            });

            // Verify the approval was successful
            const newAllowance = await erc20Contract.allowance(
              walletAddress,
              COLLECTION_CONFIG.CONTRACT_ADDRESS
            );
            console.log('Raw new allowance response:', newAllowance);

            let newAllowanceValue: number;
            if (newAllowance.allowance?.value) {
              newAllowanceValue = Number(newAllowance.allowance.value);
            } else if (newAllowance.allowance) {
              newAllowanceValue = Number(newAllowance.allowance);
            } else if (newAllowance.value) {
              newAllowanceValue = Number(newAllowance.value);
            } else {
              newAllowanceValue = Number(newAllowance);
            }

            console.log('New allowance after approval:', newAllowanceValue);

            if (newAllowanceValue >= priceAmount) {
              mintStatus = `✅ ${selectedToken} PERMISSIONS GRANTED! PROCEEDING WITH MINT...`;
            } else {
              throw new Error(
                `Approval failed: new allowance (${newAllowanceValue}) is less than required (${priceAmount})`
              );
            }
          }
        } catch (approvalError: any) {
          console.error('Approval failed:', approvalError);
          console.error('Approval error details:', {
            message: approvalError.message,
            code: approvalError.code,
            data: approvalError.data,
            fullError: approvalError,
          });
          mintStatus = `⚠️ APPROVAL FAILED: ${approvalError.message || 'Unknown error'}`;
          return;
        }
      }

      mintStatus = `💸 TRANSFERRING ${selectedPaymentToken.price} ${selectedToken} TO THE VOID...`;

      let mintCall;

      // Call the mint function with quantity and payment token
      mintCall = contract.populate('mint', [
        1, // quantity - mint 1 NFT
        selectedPaymentToken.address, // payment token address
      ]);
      mintStatus = '🎭 SUMMONING YOUR SCHIZO BROTHER FROM THE ABYSS...';

      const tx = await account.execute(mintCall);

      mintStatus = '⚡ TRANSACTION LAUNCHED INTO THE BLOCKCHAIN MATRIX! ⚡';
      console.log('Transaction hash:', tx.transaction_hash);

      // Wait for transaction with timeout and better error handling
      try {
        await provider.waitForTransaction(tx.transaction_hash, {
          retryInterval: 2000, // Check every 2 seconds
          successStates: ['ACCEPTED_ON_L1', 'ACCEPTED_ON_L2'],
        });

        // Set the correct token ID (the one that was just minted)
        lastMintedId = currentSupply;
        // Update reveal status based on the token ID
        isRevealed = shouldRevealNFT(lastMintedId);

        // Increment supply after setting the token ID
        currentSupply += 1;

        console.log(
          `🎉 NFT minted successfully! Token ID: ${lastMintedId}, Revealed: ${isRevealed}`
        );
        console.log(`Image URL will be: ${getIPFSImageUrl(lastMintedId)}`);
        console.log(
          `lastMintedId set to: ${lastMintedId}, should show Freshly Adopted section: ${lastMintedId !== null}`
        );

        mintStatus = `🎉 SCHIZO BROTHER #${lastMintedId} HAS BEEN BORN! WELCOME TO THE FAMILY! 🎉`;

        // Play success sound
        playSuccessSound();

        // Show transaction toast
        showTransactionToast(
          tx.transaction_hash,
          lastMintedId,
          selectedPaymentToken.price,
          selectedToken
        );

        // Random celebration popup
        setTimeout(() => {
          if (lastMintedId !== null) {
            showMintingSuccessPopup(
              walletAddress,
              lastMintedId,
              selectedPaymentToken.price,
              selectedToken
            );
          }
        }, 1000);
      } catch (waitError: any) {
        console.error('Transaction wait failed:', waitError);

        if (waitError.message?.includes('TimedOut')) {
          mintStatus = `⏰ TRANSACTION TIMEOUT! Your NFT might still be processing. Check your wallet for transaction: ${tx.transaction_hash.slice(0, 10)}...`;

          // Show transaction hash for manual checking
          showTransactionHashPopup(tx.transaction_hash);
        } else {
          mintStatus = `⚠️ TRANSACTION UNCERTAIN! Error: ${waitError.message || 'Unknown error'}. Check your wallet for transaction status.`;
        }
      }
    } catch (error: any) {
      console.error('Minting failed:', error);

      // Provide more specific error messages
      if (error.message?.includes('ENTRYPOINT_NOT_FOUND')) {
        mintStatus =
          '💥 FUNCTION NOT FOUND! The contract might be different than expected.';
      } else if (error.message?.includes('insufficient funds')) {
        mintStatus = '💰 INSUFFICIENT FUNDS! Make sure you have enough tokens.';
      } else if (error.message?.includes('user rejected')) {
        mintStatus = '👻 USER REJECTED! The ritual was cancelled.';
      } else if (error.message?.includes('Insufficient token allowance')) {
        mintStatus = `🔐 INSUFFICIENT ${selectedToken} ALLOWANCE! The approval process may have failed. Try again.`;
      } else if (
        error.message?.includes('timeout') ||
        error.message?.includes('TimedOut')
      ) {
        mintStatus =
          '⏰ NETWORK TIMEOUT! The blockchain is slow today. Try again in a few minutes.';
      } else if (
        error.message?.includes('network') ||
        error.message?.includes('connection')
      ) {
        mintStatus =
          '🌐 NETWORK ERROR! Check your internet connection and try again.';
      } else {
        mintStatus = `💥 THE SIMULATION GLITCHED! Error: ${error.message || 'Unknown error'}`;
      }
    }