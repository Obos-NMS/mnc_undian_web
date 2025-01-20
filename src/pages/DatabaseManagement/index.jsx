import SimpleBar from "simplebar-react";
import { Outlet, useNavigate } from "react-router-dom";

// component
import MyHorizontalTab from "../../components/HorizontalTab/MyHorizontalTab";
import MyTabButton from "../../components/HorizontalTab/MyTabButton";

export default function DatabasesManagement() {
    const navigate = useNavigate();

    return (
        <SimpleBar forceVisible="y" className="flex-1" style={{ height: "100vh" }}>
            <main className="pt-24 sm:pt-8 pb-12 flex flex-col gap-8">
                <div className="px-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <p className="display-sm-semibold text-gray-light/900">
                            Database management
                        </p>
                        <p className="text-gray-light/600">
                            Atur data peserta dan hadiah.
                        </p>
                    </div>
                    <MyHorizontalTab isCheckSamePath type={"underline"}
                        onChange={(value) => navigate(value)}>
                        <MyTabButton value={"participant"} segment={2}>
                            <p className="truncate">Peserta</p>
                        </MyTabButton>
                        <MyTabButton value={"raffle-prize"} segment={2}>
                            <p className="truncate">Hadiah</p>
                        </MyTabButton>
                    </MyHorizontalTab>
                </div>
                <Outlet />
            </main>
        </SimpleBar>
    );
}
