import { OutlinedInput } from "@mui/material";
import { useState } from "react";
import { ICON_BASE_PATH, ICONS, ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";

import styles from "./IncidentChatTab.module.scss";

const IncidentChatTab = () => {
  const [chatText, setChatText] = useState(
    `faucibus turpis purus. Ut malesuada porttitor libero, a bibendum dui laoreet sit amet. Quisque non eros eget sem viverra elementum sed in velit. Quisque sit amet elit id nunc eleifend faucibus sed nec massa. Maecenas eget lacus neque. Quisque nec gravida dui. Phasellus semper nisi lacinia lacinia imperdiet. Vivamus vitae lorem at lorem tempor molestie quis non erat. Aenean efficitur erat quis hendrerit varius.

    Praesent nisl orci, scelerisque sed arcu et, semper dapibus nunc. Ut hendrerit placerat lobortis. Nullam tincidunt, felis congue semper ornare, sem metus placerat massa, ut bibendum lacus dui in ex. Cras a dui magna. Praesent accumsan finibus tempor. Cras pharetra diam quis elementum tincidunt. Nulla interdum ac augue vel luctus. Suspendisse et suscipit erat. Fusce imperdiet felis a augue accumsan, sit amet maximus diam fringilla. Mauris dapibus non massa et tristique. Phasellus dapibus dolor vel mauris tempor, in maximus velit ultrices. Duis suscipit sapien vitae condimentum fermentum. Aenean eu rhoncus ligula. Donec sollicitudin lobortis nunc.
    
    Pellentesque venenatis id ex eu luctus. Morbi semper maximus ex quis venenatis. Cras posuere ut justo vel semper. Fusce quis quam condimentum, rhoncus libero eu, scelerisque nibh. Ut quis interdum dolor. Praesent leo dui, ullamcorper nec imperdiet et, cursus vel urna. Sed tincidunt, sapien et facilisis congue, lectus elit vestibulum velit, quis consectetur ante sapien accumsan dui. Aenean suscipit, velit vitae ornare feugiat, elit ligula pulvinar eros, id venenatis diam tellus vel risus. Aenean tellus nibh, feugiat nec lacus ut, euismod iaculis lectus. Pellentesque ultricies massa libero, vitae commodo arcu scelerisque et.
    
    Curabitur varius fringilla velit, at facilisis nisi egestas non. Sed eu consequat turpis. Morbi efficitur dolor et vestibulum finibus. Proin dignissim neque risus, sed consectetur augue rhoncus sed. Sed vel nunc eu sem gravida sollicitudin nec sit amet sapien. Nunc fringilla eleifend congue. Cras finibus diam hendrerit metus gravida, nec tristique sem viverra. Integer eu tellus neque. In neque dolor, placerat vel tempor vitae, consequat quis nisl. Quisque non magna in arcu cursus porttitor. Fusce justo eros, posuere eget aliquet in, tincidunt vitae justo. In mattis tellus et risus molestie commodo. Donec vel leo euismod, consectetur velit sit amet, ultricies nisi. In in turpis quis metus dictum lobortis et at lacus.
    
    Aliquam blandit ex sed justo consectetur pulvinar. Fusce pretium ligula est, vel vestibulum urna malesuada eu. Sed et vehicula magna, id ultrices risus. In hac habitasse platea dictumst. Donec ante mauris, interdum ut egestas in, vestibulum vel eros. Aliquam vulputate nunc a viverra ornare. Donec nibh sem, faucibus quis velit ac, semper porttitor eros. Quisque eget sapien hendrerit, mattis quam sed, aliquam elit. Duis luctus semper lectus maximus tempor. Nunc hendrerit feugiat leo. Donec quis ante commodo, bibendum risus vitae, euismod turpis. Vivamus luctus, purus a mattis ultricies, est enim dapibus neque, ac vestibulum arcu turpis eget ligula. Curabitur tempus erat quis massa imperdiet, eget tincidunt mi imperdiet. Nam maximus, tellus vel facilisis tincidunt, dui tellus eleifend sapien, sagittis semper felis neque ac quam. Duis bibendum lectus non velit laoreet, sed euismod leo feugiat. faucibus turpis purus. Ut malesuada porttitor libero, a bibendum dui laoreet sit amet. Quisque non eros eget sem viverra elementum sed in velit. Quisque sit amet elit id nunc eleifend faucibus sed nec massa. Maecenas eget lacus neque. Quisque nec gravida dui. Phasellus semper nisi lacinia lacinia imperdiet. Vivamus vitae lorem at lorem tempor molestie quis non erat. Aenean efficitur erat quis hendrerit varius.

    Praesent nisl orci, scelerisque sed arcu et, semper dapibus nunc. Ut hendrerit placerat lobortis. Nullam tincidunt, felis congue semper ornare, sem metus placerat massa, ut bibendum lacus dui in ex. Cras a dui magna. Praesent accumsan finibus tempor. Cras pharetra diam quis elementum tincidunt. Nulla interdum ac augue vel luctus. Suspendisse et suscipit erat. Fusce imperdiet felis a augue accumsan, sit amet maximus diam fringilla. Mauris dapibus non massa et tristique. Phasellus dapibus dolor vel mauris tempor, in maximus velit ultrices. Duis suscipit sapien vitae condimentum fermentum. Aenean eu rhoncus ligula. Donec sollicitudin lobortis nunc.
    
    Pellentesque venenatis id ex eu luctus. Morbi semper maximus ex quis venenatis. Cras posuere ut justo vel semper. Fusce quis quam condimentum, rhoncus libero eu, scelerisque nibh. Ut quis interdum dolor. Praesent leo dui, ullamcorper nec imperdiet et, cursus vel urna. Sed tincidunt, sapien et facilisis congue, lectus elit vestibulum velit, quis consectetur ante sapien accumsan dui. Aenean suscipit, velit vitae ornare feugiat, elit ligula pulvinar eros, id venenatis diam tellus vel risus. Aenean tellus nibh, feugiat nec lacus ut, euismod iaculis lectus. Pellentesque ultricies massa libero, vitae commodo arcu scelerisque et.
    
    Curabitur varius fringilla velit, at facilisis nisi egestas non. Sed eu consequat turpis. Morbi efficitur dolor et vestibulum finibus. Proin dignissim neque risus, sed consectetur augue rhoncus sed. Sed vel nunc eu sem gravida sollicitudin nec sit amet sapien. Nunc fringilla eleifend congue. Cras finibus diam hendrerit metus gravida, nec tristique sem viverra. Integer eu tellus neque. In neque dolor, placerat vel tempor vitae, consequat quis nisl. Quisque non magna in arcu cursus porttitor. Fusce justo eros, posuere eget aliquet in, tincidunt vitae justo. In mattis tellus et risus molestie commodo. Donec vel leo euismod, consectetur velit sit amet, ultricies nisi. In in turpis quis metus dictum lobortis et at lacus.
    
    Aliquam blandit ex sed justo consectetur pulvinar. Fusce pretium ligula est, vel vestibulum urna malesuada eu. Sed et vehicula magna, id ultrices risus. In hac habitasse platea dictumst. Donec ante mauris, interdum ut egestas in, vestibulum vel eros. Aliquam vulputate nunc a viverra ornare. Donec nibh sem, faucibus quis velit ac, semper porttitor eros. Quisque eget sapien hendrerit, mattis quam sed, aliquam elit. Duis luctus semper lectus maximus tempor. Nunc hendrerit feugiat leo. Donec quis ante commodo, bibendum risus vitae, euismod turpis. Vivamus luctus, purus a mattis ultricies, est enim dapibus neque, ac vestibulum arcu turpis eget ligula. Curabitur tempus erat quis massa imperdiet, eget tincidunt mi imperdiet. Nam maximus, tellus vel facilisis tincidunt, dui tellus eleifend sapien, sagittis semper felis neque ac quam. Duis bibendum lectus non velit laoreet, sed euismod leo feugiat.`
  );

  return (
    <div className={styles.container}>
      <div className={styles["chat-box-container"]}>
        <div className={styles["logo-container"]}>
          <div className={styles["chatbox-logo"]}>
            <img src={ZEROK_MINIMAL_LOGO_LIGHT} alt="chatbox-logo" />
          </div>
        </div>
        <div className={styles["text-container"]}>
          <p>{chatText}</p>
        </div>
      </div>
      <div className={styles["chat-input-container"]}>
        <OutlinedInput
          fullWidth
          className={styles["chat-input"]}
          placeholder="Type something..."
          endAdornment={
            <span className={styles["send-icon"]} role="button">
              <img src={`${ICON_BASE_PATH}/${ICONS.send}`} alt="send_icon" />
            </span>
          }
        />
      </div>
    </div>
  );
};

export default IncidentChatTab;
