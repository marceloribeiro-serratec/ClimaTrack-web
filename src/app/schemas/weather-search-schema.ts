import { z } from "zod";

export const weatherSearchSchema = z.object({
    city: z.string().trim().min(2, "Digite ao menos 2 caracteres."),
});

export type WeatherSearchFormData = z.infer<typeof weatherSearchSchema>;

