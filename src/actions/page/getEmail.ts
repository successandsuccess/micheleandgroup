export const GetEmail = async (
    ) => {
      
      const hero_record  = await fetch("/api/page/get-email", {
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
    