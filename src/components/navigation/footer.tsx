import Link from "next/link";
import FadeInWrapper from "../fade-in-wrapper";

function Footer() {
  let currentYear = new Date().getFullYear();

  return (
    <FadeInWrapper>
      <div className="mx-auto flex h-full min-h-fit w-full max-w-[98vw] justify-center pt-[140px]">
        <div className="flex w-full justify-center border-2 border-b-0 border-dashed border-custom-gray hover:border-custom-gray-hover">
          <span className="my-[40px] text-[13px] font-semibold uppercase text-custom-gray lg:my-[90px]">
            <Link
              href={"https://jxlx.world"}
              target="_blank"
              className="cursor-pointer hover:text-custom-gray-hover"
            >
              &copy; {currentYear} jxlx. Work in progress
            </Link>
          </span>
        </div>
      </div>
    </FadeInWrapper>
  );
}

export default Footer;
