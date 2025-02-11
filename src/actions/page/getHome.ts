export const GetHome = async (
  ) => {
    
    const hero_record  = await fetch("/api/page/get-hero", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const talents_record  = await fetch("/api/page/get-talents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const section_record  = await fetch("/api/page/get-section", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });
    console.log("RRRRRRRRRRRR", hero_record);
    const hero_data = await hero_record.json();
    const talents_data = await talents_record.json();
    const section_data = await section_record.json();
    return { status: true, hero: hero_data, talents: talents_data, section: section_data };
  };
  