import React from 'react';

export const TermsText = () => (
  <>
    <p className="mb-2 font-semibold">Important Stuff</p>

    <p className="text-sm">
      By clicking <span className="font-semibold">"Confirm &amp; Book"</span>, you&apos;re basically saying:
      <br />
      <span className="italic">“Yeah, I read this… kinda… and I’m cool with it.”</span>
    </p>

    <ul className="mt-2 list-disc list-inside text-sm space-y-1">
      <li>
        You promise you’re allowed to request service for this vehicle
        (owner, family member, or the officially approved car boss).
      </li>
      <li>
        We’ll try our best to help your car, but we can’t perform miracles,
        time travel, or undo years of neglect in one visit.
      </li>
      <li>
        Prices shown are estimates — final cost may change after a proper diagnosis,
        and nothing extra happens without your okay.
      </li>
      <li>
        Please be available at the selected time and place, or give us a heads-up
        if plans change. Life happens, we get it.
      </li>
      <li>
        No fake bookings, spam, hacking attempts, or “let’s see what breaks” energy.
        Be cool.
      </li>
      <li>
        This is a personal project, so things may evolve, improve, or occasionally
        act a little quirky.
      </li>
      <li>
        The app is provided “as is” — we’re not responsible for indirect, unexpected,
        or very weird side effects of using it.
      </li>
    </ul>
  </>
);

export const PrivacyText = () => (
  <>
    <p className="mt-4 mb-2 font-semibold">Privacy Policy (The Honest Version)</p>

    <p className="text-sm">
      We only collect the info needed to make this thing actually work — nothing shady.
    </p>

    <ul className="mt-2 list-disc list-inside text-sm space-y-1">
      <li>
        Your contact details, address, and car info are used only to schedule
        and manage your booking.
      </li>
      <li>
        Your data lives in this project’s database or logs so the app can function
        and improve over time.
      </li>
      <li>
        We do <span className="font-semibold">not</span> sell your data, trade it,
        or hand it over to random marketers with weird ads.
      </li>
      <li>
        If you want your data updated or removed, you can ask — it’ll be handled manually
        like a civilized human interaction.
      </li>
      <li>
        Any basic cookies or analytics are just for keeping the app running
        and understanding usage, not stalking you across the internet.
      </li>
    </ul>

    <p className="mt-2 text-xs italic text-gray-500">
      TL;DR: Your data is safe here. No funny business.
    </p>
  </>
);
