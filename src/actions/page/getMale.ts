export const GetMale = async (
    ) => {
      
      const hero_record  = await fetch("/api/page/get-male", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        }),
      });
  
      const hero_data = await hero_record.json();
      return { status: true, data: hero_data };
    };
    