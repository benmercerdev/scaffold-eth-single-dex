import { List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { Address, TokenBalance } from "../components";
import { ethers } from "ethers";
import { Skeleton, Typography } from "antd";

/*
  ~ What it does? ~

  Displays a lists of events
  Smartly displays based on type (eth address, token balance, other (renders as string))

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    argTitles="Owner | Spender | Value"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
*/

export default function SmartEvents({
  contracts,
  contractName,
  eventName,
  titleHeader,
  localProvider,
  mainnetProvider,
  startBlock,
}) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);
  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>
        {eventName} Events
        <br />
        {titleHeader}
      </h2>
      <List
        bordered
        dataSource={events}
        renderItem={item => {
          return (
            <List.Item key={item.blockNumber + "_" + item.args[0].toString()}>
              {item.args.map(arg => {
                return ethers.utils.isAddress(arg) ? (
                  <Address address={arg} ensProvider={mainnetProvider} fontSize={16} />
                ) : arg._isBigNumber ? (
                  <TokenBalance balance={arg} provider={localProvider} />
                ) : (
                  <Typography>`${arg.toString()}`</Typography>
                );
              })}
            </List.Item>
          );
        }}
      />
    </div>
  );
}
