import { List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { Address, TokenBalance } from "../components";
import { ethers } from "ethers";

/*
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"

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
                console.log(arg);
                console.log(typeof arg);
                if (ethers.utils.isAddress(arg)) {
                  return <Address address={arg} ensProvider={mainnetProvider} fontSize={16} />;
                } else if (arg._isBigNumber) {
                  return <TokenBalance balance={arg} provider={localProvider} />;
                } else {
                  return `${arg.toString()}`;
                }
              })}
            </List.Item>
          );
        }}
      />
    </div>
  );
}
