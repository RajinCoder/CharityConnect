import Image from "next/image";

export default function Owners() {
  return (
    <div className="bg-blue-500 w-full  h-28 text-white flex justify-between items-center px-8">
      <div className="flex flex-col">
        <h3 className="text-xl font-normal">Jack Mitchell CS4550-01</h3>
        <h3 className="text-xl font-normal">Peter Moise CS4550-01</h3>
      </div>
      <a
        className="flex items-center"
        target="_blank"
        href="https://github.com/RajinCoder/CharityConnect"
      >
        <Image
          src={`/Images/github.svg`}
          alt="github image"
          width={50}
          height={50}
        ></Image>
      </a>
    </div>
  );
}
