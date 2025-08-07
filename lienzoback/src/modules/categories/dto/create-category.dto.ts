export class CreateCategoryDto {
  /**
   *@description category´s name
   *@example vegetariano
   */
  name: string;

  /**
   *@description category´s description
   *@example "Comidas sin carne, ave ni pescado, que pueden incluir lácteos y huevos, perfectas para quienes siguen esta dieta."
   */
  description: string;
}
