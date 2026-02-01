/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

export const registerPatient = async (
    _currentState: any,
    formData: any,
): Promise<any> => {
    try {
        const registerDate = {
            password: formData.get("password"),
            patient: {
                name: formData.get("name"),
                email: formData.get("email"),
            },
        };

        const newFormData = new FormData();
        newFormData.append("data", JSON.stringify(registerDate));
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/create-patient`,
            {
                method: "POST",
                body: newFormData,
            },
        ).then((res) => res.json());
        console.log("Register Patient Response:", res);
        return res;
    } catch (error) {
        console.error("Error registering patient:", error);
        return { error: "Failed to register patient" };
    }
};
