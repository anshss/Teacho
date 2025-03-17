import { apple, bill, google } from "../assets";
import styles, { layout } from "../styles/style";
import Image from "next/image";

const Billing = () => (
  <section id="product" className={layout.sectionReverse}>
    <div className={layout.sectionImgReverse}>
      <Image 
        src={bill} 
        alt="Billing interface preview" 
        width={500} 
        height={500} 
        className="w-full h-full relative z-[5]" 
        priority 
      />

      {/* Gradient Effects */}
      <div className="absolute z-[3] -left-1/2 top-0 w-1/2 h-1/2 rounded-full white__gradient" />
      <div className="absolute z-[0] w-1/2 h-1/2 -left-1/2 bottom-0 rounded-full pink__gradient" />
    </div>

    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Easily control your <br className="sm:block hidden" /> billing & invoicing
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Manage all your transactions in one place with ease. Track payments, 
        automate invoices, and stay organized effortlessly. Our intuitive 
        interface ensures smooth financial management without the hassle.
      </p>

      <div className="flex flex-row flex-wrap sm:mt-10 mt-6">
        <Image 
          src={apple} 
          alt="Download on the App Store" 
          width={129} 
          height={42} 
          className="object-contain mr-5 cursor-pointer" 
          loading="lazy" 
        />
        <Image 
          src={google} 
          alt="Get it on Google Play" 
          width={144} 
          height={43} 
          className="object-contain cursor-pointer" 
          loading="lazy" 
        />
      </div>
    </div>
  </section>
);

export default Billing;
