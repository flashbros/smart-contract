import styles from "./styles.module.css";
import LeftPanel from "./[components]/[leftPanel]/leftPanel";
import RightPanel from "./[components]/[rightPanel]/rightPanel";
import Header from "./[components]/[header]/header";


const HomePage = () => (
  <>
    <Header />
    <LeftPanel />
    <div className={styles.dividerY}/>
    <RightPanel />
  </>
);

export default HomePage;
