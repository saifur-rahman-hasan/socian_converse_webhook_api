export default abstract class BaseModel {
    abstract create(): void;
    abstract update(): void;
    abstract delete(): void;
    abstract find(): void;
    abstract findMany(): void;
}