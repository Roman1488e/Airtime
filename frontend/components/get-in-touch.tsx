import type { Dictionary, Locale } from "@/types";
import Button from "./button";

interface ContactBannerProps {
  dictionary: Dictionary;
  lang: Locale;
}

export default function GetInTouch({ dictionary, lang }: ContactBannerProps) {
  return (
    <section className="relative px-4 md:px-24 flex justify-center items-center overflow-hidden h-[400px] bg-[#c5dae9] py-12">
      {/* To'lqinsimon chiziqlar (background design) */}
      <div className="absolute inset-0 z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C150,50 350,0 500,100 C650,200 850,100 1000,50 C1150,0 1300,50 1440,100 V200 H0 Z"
            fill="white"
            fillOpacity="0.1"
          />
          <path
            d="M0,120 C150,70 350,20 500,120 C650,220 850,120 1000,70 C1150,20 1300,70 1440,120 V200 H0 Z"
            fill="white"
            fillOpacity="0.1"
          />
          <path
            d="M0,140 C150,90 350,40 500,140 C650,240 850,140 1000,90 C1150,40 1300,90 1440,140 V200 H0 Z"
            fill="white"
            fillOpacity="0.1"
          />
        </svg>
      </div>

      <div className="container  relative z-10 mx-auto  md:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              {dictionary.contacts.getInTouch}
            </h2>
            <p className="mt-2 text-gray-700">
              {dictionary.contacts.contactMessage}
            </p>
          </div>
          <Button href={`/${lang}/contacts`}>
            {dictionary.contacts.contactUs}
          </Button>
        </div>
      </div>
    </section>
  );
}
