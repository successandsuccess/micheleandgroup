export const GetEmailTemplate = async (
    ) => {
      
      const hero_record  = await fetch("/api/page/get-email-template", {
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
    