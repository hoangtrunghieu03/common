import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()

export class DestroySubsribeService implements OnDestroy{

    public destroySub$ = new Subject<void>();

    ngOnDestroy(): void {
        this.destroySub$.next();
        this.destroySub$.complete();
    }
}